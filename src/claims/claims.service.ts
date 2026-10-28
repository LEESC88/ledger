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
   * ============================================================================
   * 1. 查询当前用户的所有代垫账单 (findAll)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 判断是否传入了 userId:
   *      const whereCondition = userId ? { userId } : {};
   * 2. 使用 claimRepository.find 查询并按创建时间倒序:
   *      return await this.claimRepository.find({
   *        where: whereCondition,
   *        order: { createdAt: 'DESC' },
   *      });
   * ============================================================================
   */
  async findAll(userId?: string): Promise<Claim[]> {
    // ✍️ YOUR TURN: Write your code below this line:
    const whereCondition = userId ? { userId } : {};
    return await this.claimRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * ============================================================================
   * 2. 创建新的代垫分摊账单 (create)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 生成唯一 ID:
   *      const id = 'claim_' + Date.now();
   * 2. 为每个朋友对象默认附加 paid: false 待付状态:
   *      const friendsWithStatus = (createClaimDto.friends || []).map((f) => ({
   *        name: f.name,
   *        amount: f.amount,
   *        paid: false,
   *      }));
   * 3. 实例化实体并持久化保存:
   *      const claim = this.claimRepository.create({
   *        id,
   *        userId,
   *        title: createClaimDto.title,
   *        totalAmount: createClaimDto.totalAmount,
   *        myShare: createClaimDto.myShare,
   *        friends: friendsWithStatus,
   *        status: 'active',
   *        date: createClaimDto.date,
   *      });
   *      return await this.claimRepository.save(claim);
   * ============================================================================
   */
  async create(
    createClaimDto: CreateClaimDto,
    userId?: string,
  ): Promise<Claim> {
    // ✍️ YOUR TURN: Write your code below this line:
    const id = 'claim_' + Date.now();
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
   * ============================================================================
   * 3. 切换某位朋友的付款状态 (已还/待收) (toggleFriendPaid)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找指定 claim 账单:
   *      const claim = await this.claimRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!claim) throw new NotFoundException('Claim not found');
   * 2. 检查 friends 数组及索引是否存在，反转该朋友的 paid 状态:
   *      if (claim.friends && claim.friends[friendIndex]) {
   *        claim.friends[friendIndex].paid = !claim.friends[friendIndex].paid;
   *        // 检查是否全员都还清了，若是则将账单状态更新为 'settled'
   *        const allPaid = claim.friends.every((f) => f.paid);
   *        claim.status = allPaid ? 'settled' : 'active';
   *      }
   * 3. 保存并返回:
   *      return await this.claimRepository.save(claim);
   * ============================================================================
   */
  async toggleFriendPaid(
    id: string,
    friendIndex: number,
    userId?: string,
  ): Promise<Claim> {
    // ✍️ YOUR TURN: Write your code below this line:
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
   * ============================================================================
   * 4. 全员结清并归档 (settleAll)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找账单:
   *      const claim = await this.claimRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!claim) throw new NotFoundException('Claim not found');
   * 2. 遍历 friends 数组将所有 paid 置为 true，并将 status 置为 'settled':
   *      if (Array.isArray(claim.friends)) {
   *        claim.friends.forEach((f) => { f.paid = true; });
   *      }
   *      claim.status = 'settled';
   * 3. 保存并返回:
   *      return await this.claimRepository.save(claim);
   * ============================================================================
   */
  async settleAll(id: string, userId?: string): Promise<Claim> {
    // ✍️ YOUR TURN: Write your code below this line:
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
   * ============================================================================
   * 5. 删除账单 (remove)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找要删除的账单:
   *      const claim = await this.claimRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!claim) throw new NotFoundException('Claim not found');
   * 2. 从数据库删除:
   *      await this.claimRepository.remove(claim);
   *      return { success: true };
   * ============================================================================
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    // ✍️ YOUR TURN: Write your code below this line:
    const claim = await this.claimRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!claim) throw new NotFoundException('Claim not found');
    await this.claimRepository.remove(claim);
    return { success: true };
  }
}
