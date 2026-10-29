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
   * 1. 查询当前用户的所有专款项目 (findAll)
   */
  async findAll(userId?: string): Promise<Project[]> {
    const whereCondition = userId ? { userId } : {};
    return await this.projectRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 2. 创建新的专款预留池 (create)
   */
  async create(
    createProjectDto: CreateProjectDto,
    userId?: string,
  ): Promise<Project | null> {
    const id = createProjectDto.id || 'proj_' + Date.now();
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
   * 3. 专款结案平账 (settle)
   */
  async settle(id: string, userId?: string): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * 4. 提前释放结余资金回日常预算 (release)
   */
  async release(id: string, userId?: string): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.targetAmount = project.spentAmount;
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * 5. 撤销 / 删除专款 (remove)
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepository.remove(project);
    return { success: true };
  }

  /**
   * 6. 更新专款已消耗金额 (updateSpentAmount)
   */
  async updateSpentAmount(
    id: string,
    spentAmount: number,
    userId?: string,
  ): Promise<Project | null> {
    const project = await this.projectRepository.findOne({
      where: userId ? { id, userId } : { id },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.spentAmount = spentAmount;
    return await this.projectRepository.save(project);
  }
}
