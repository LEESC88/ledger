import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity.js';
import { CreateClaimDto } from './dto/create-claim.dto.js';
import { UpdateClaimDto } from './dto/update-claim.dto.js';

/**
 * ClaimsService
 * Handles business logic and database persistence for Claims, Split Bills & Advance Payments.
 */
@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  /**
   * 1. 查询当前用户的所有代垫账单 (findAll)
   * Strict tenant isolation: returns empty array if userId is not provided.
   */
  async findAll(userId?: string): Promise<Claim[]> {
    if (!userId) {
      return [];
    }
    return await this.claimRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 2. 创建新的代垫分摊账单 (create)
   */
  async create(
    createClaimDto: CreateClaimDto,
    userId?: string,
  ): Promise<Claim> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const id = createClaimDto.id || 'claim_' + Date.now();
    const friendsWithStatus = (createClaimDto.friends || []).map((f) => ({
      name: f.name,
      amount: f.amount,
      paid: false,
    }));
    const claim = this.claimRepository.create({
      id,
      userId,
      title: createClaimDto.title,
      totalAmount: createClaimDto.totalAmount,
      myShare: createClaimDto.myShare,
      friends: friendsWithStatus,
      status: 'active',
      date: createClaimDto.date,
    });
    return await this.claimRepository.save(claim);
  }

  /**
   * 3. 切换某位朋友的付款状态 (已还/待收) (toggleFriendPaid)
   */
  async toggleFriendPaid(
    id: string,
    friendIndex: number,
    userId?: string,
    paidVia?: string,
  ): Promise<Claim> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const claim = await this.claimRepository.findOne({
      where: { id, userId },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    if (claim.friends && claim.friends[friendIndex]) {
      const target = claim.friends[friendIndex];
      target.paid = !target.paid;
      if (target.paid) {
        const cleanedVia = (paidVia || '').trim();
        if (cleanedVia) {
          target.paid_via = cleanedVia;
        }
      } else {
        delete target.paid_via;
      }
      const allPaid = claim.friends.every((f) => f.paid);
      claim.status = allPaid ? 'settled' : 'active';
    }
    return await this.claimRepository.save(claim);
  }

  /**
   * 4. 全员结清并归档 (settleAll)
   */
  async settleAll(
    id: string,
    userId?: string,
    paidVia?: string,
  ): Promise<Claim> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const claim = await this.claimRepository.findOne({
      where: { id, userId },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    const cleanedVia = (paidVia || '').trim();
    if (Array.isArray(claim.friends)) {
      claim.friends.forEach((f) => {
        if (!f.paid) {
          f.paid = true;
          if (cleanedVia) f.paid_via = cleanedVia;
        } else if (!f.paid_via && cleanedVia) {
          f.paid_via = cleanedVia;
        }
      });
    }
    claim.status = 'settled';
    return await this.claimRepository.save(claim);
  }

  /**
   * 5. 更新代垫账单内容与分摊明细 (update)
   */
  async update(
    id: string,
    updateClaimDto: UpdateClaimDto,
    userId?: string,
  ): Promise<Claim> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const claim = await this.claimRepository.findOne({
      where: { id, userId },
    });
    if (!claim) throw new NotFoundException('Claim not found');

    const nextTotal =
      updateClaimDto.totalAmount !== undefined
        ? Number(updateClaimDto.totalAmount.toFixed(2))
        : Number(claim.totalAmount);
    const nextFriends =
      updateClaimDto.friends !== undefined
        ? updateClaimDto.friends.map((f) => {
            const paid = Boolean(f.paid);
            const cleanedVia = paid ? (f.paid_via || '').trim() : '';
            return {
              name: f.name.trim(),
              amount: Number(f.amount.toFixed(2)),
              paid,
              ...(cleanedVia ? { paid_via: cleanedVia } : {}),
            };
          })
        : Array.isArray(claim.friends)
          ? claim.friends
          : [];

    const friendsSum = nextFriends.reduce(
      (sum, f) => sum + (Number(f.amount) || 0),
      0,
    );
    if (friendsSum > nextTotal + 0.001) {
      throw new BadRequestException('Split sum cannot exceed total amount');
    }

    if (updateClaimDto.title !== undefined) {
      claim.title = updateClaimDto.title.trim();
    }
    claim.totalAmount = nextTotal;
    claim.friends = nextFriends;

    if (updateClaimDto.myShare !== undefined) {
      claim.myShare = Math.max(0, Number(updateClaimDto.myShare.toFixed(2)));
    } else if (
      updateClaimDto.totalAmount !== undefined ||
      updateClaimDto.friends !== undefined
    ) {
      claim.myShare = Math.max(0, Number((nextTotal - friendsSum).toFixed(2)));
    }

    if (updateClaimDto.date !== undefined) {
      claim.date = updateClaimDto.date;
    }

    if (updateClaimDto.friends !== undefined) {
      const allPaid =
        nextFriends.length > 0 && nextFriends.every((f) => f.paid);
      claim.status = allPaid ? 'settled' : 'active';
    } else if (updateClaimDto.status !== undefined) {
      claim.status = updateClaimDto.status;
    }

    return await this.claimRepository.save(claim);
  }

  /**
   * 6. 删除账单 (remove)
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const claim = await this.claimRepository.findOne({
      where: { id, userId },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    await this.claimRepository.remove(claim);
    return { success: true };
  }
}
