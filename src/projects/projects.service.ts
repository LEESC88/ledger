import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';

/**
 * ProjectsService
 * Handles business logic and database persistence for Sinking Funds & Projects.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * ============================================================================
   * 1. 查询当前用户的所有专款项目 (findAll)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 判断是否传入了 userId:
   *      const whereCondition = userId ? { userId } : {};
   * 2. 使用 projectRepository.find 查询并按创建时间倒序排序:
   *      return await this.projectRepository.find({
   *        where: whereCondition,
   *        order: { createdAt: 'DESC' },
   *      });
   * ============================================================================
   */
  async findAll(userId?: string): Promise<Project[]> {
    // ✍️ YOUR TURN: Write your code below this line:
    const whereCondition = userId ? { userId } : {};
    return await this.projectRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * ============================================================================
   * 2. 创建新的专款预留池 (create)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 生成唯一 ID 与当前月份键 (YYYY-MM):
   *      const id = 'proj_' + Date.now();
   *      const d = new Date();
   *      const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
   * 2. 通过 create 方法实例化实体:
   *      const project = this.projectRepository.create({
   *        id,
   *        userId,
   *        title: createProjectDto.title,
   *        icon: createProjectDto.icon || '🎯',
   *        targetAmount: createProjectDto.targetAmount,
   *        spentAmount: 0,
   *        mode: createProjectDto.mode || 'budget_deduct',
   *        month: createProjectDto.month || currentMonth,
   *        status: 'active',
   *      });
   * 3. 持久化存储到数据库:
   *      return await this.projectRepository.save(project);
   * ============================================================================
   */
  async create(
    createProjectDto: CreateProjectDto,
    userId?: string,
  ): Promise<Project | null> {
    // ✍️ YOUR TURN: Write your code below this line:
    const id = 'proj_' + Date.now();
    const d = new Date();
    const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const project = this.projectRepository.create({
      id,
      userId,
      title: createProjectDto.title,
      icon: createProjectDto.icon || '🎯',
      targetAmount: createProjectDto.targetAmount,
      spentAmount: 0,
      mode: createProjectDto.mode || 'budget_deduct',
      month: createProjectDto.month || currentMonth,
      status: 'active',
    });

    return await this.projectRepository.save(project);
  }

  /**
   * ============================================================================
   * 3. 专款结案平账 (settle)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找对应的专款项目，校验是否存在及归属:
   *      const project = await this.projectRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!project) throw new NotFoundException('Project not found');
   * 2. 将状态更新为已结清 'settled':
   *      project.status = 'settled';
   * 3. 保存更新:
   *      return await this.projectRepository.save(project);
   * ============================================================================
   */
  async settle(id: string, userId?: string): Promise<Project | null> {
    // ✍️ YOUR TURN: Write your code below this line:
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * ============================================================================
   * 4. 提前释放结余资金回日常预算 (release)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找项目并校验:
   *      const project = await this.projectRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!project) throw new NotFoundException('Project not found');
   * 2. 将目标预留金额 targetAmount 缩减为已消费金额 spentAmount，
   *    这样在前端推算 (target - spent) 时结余变为 0，锁定额度释放回预算:
   *      project.targetAmount = project.spentAmount;
   *      project.status = 'settled';
   * 3. 保存并返回:
   *      return await this.projectRepository.save(project);
   * ============================================================================
   */
  async release(id: string, userId?: string): Promise<Project | null> {
    // ✍️ YOUR TURN: Write your code below this line:
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.targetAmount = project.spentAmount;
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * ============================================================================
   * 5. 撤销 / 删除专款 (remove)
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 查找要删除的项目:
   *      const project = await this.projectRepository.findOne({
   *        where: userId ? { id, userId } : { id },
   *      });
   *      if (!project) throw new NotFoundException('Project not found');
   * 2. 从数据库删除:
   *      await this.projectRepository.remove(project);
   *      return { success: true };
   * ============================================================================
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    // ✍️ YOUR TURN: Write your code below this line:
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepository.remove(project);
    return { success: true };
  }
}
