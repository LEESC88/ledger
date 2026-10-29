import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity.js';
import { CreateClaimDto } from './dto/create-claim.dto.js';

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
   */
  async findAll(userId?: string): Promise<Claim[]> {
    const whereCondition = userId ? { userId } : {};
    return await this.claimRepository.find({
      where: whereCondition,
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
  ): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    if (claim.friends && claim.friends[friendIndex]) {
      claim.friends[friendIndex].paid = !claim.friends[friendIndex].paid;
      const allPaid = claim.friends.every((f) => f.paid);
      claim.status = allPaid ? 'settled' : 'active';
    }
    return await this.claimRepository.save(claim);
  }

  /**
   * 4. 全员结清并归档 (settleAll)
   */
  async settleAll(id: string, userId?: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    if (Array.isArray(claim.friends)) {
      claim.friends.forEach((f) => {
        f.paid = true;
      });
    }
    claim.status = 'settled';
    return await this.claimRepository.save(claim);
  }

  /**
   * 5. 删除账单 (remove)
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    const claim = await this.claimRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    await this.claimRepository.remove(claim);
    return { success: true };
  }
}
