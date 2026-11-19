import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import type { ProjectEntryItem } from './entities/project.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

/**
 * ProjectsService
 * Handles business logic and database persistence for Dedicated Project Budget Cards.
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  /**
   * Retrieve all project cards belonging to the authenticated user.
   * Strict tenant isolation: returns empty array if userId is not provided.
   */
  async findAll(userId?: string): Promise<Project[]> {
    if (!userId) {
      return [];
    }
    return await this.projectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Create a new project budget card with optional monthly-budget visibility and custom timeframe.
   */
  async create(
    createProjectDto: CreateProjectDto,
    userId?: string,
  ): Promise<Project | null> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const id = createProjectDto.id || 'proj_' + Date.now();
    const d = new Date();
    const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = d.toISOString().slice(0, 10);
    const includeInBudget = Boolean(createProjectDto.includeInBudget);

    const project = this.projectRepository.create({
      id,
      userId,
      title: createProjectDto.title,
      icon: createProjectDto.icon || '🎯',
      targetAmount: createProjectDto.targetAmount,
      spentAmount: 0,
      mode: createProjectDto.mode || (includeInBudget ? 'budget_deduct' : 'extra'),
      month: createProjectDto.month || currentMonth,
      status: 'active',
      includeInBudget,
      timeframeType: createProjectDto.timeframeType || 'indefinite',
      startDate: createProjectDto.startDate || todayStr,
      deadline: createProjectDto.deadline ?? null,
      entries: [],
    });

    return await this.projectRepository.save(project);
  }

  /**
   * Mark a project card as completed ('settled') while retaining full historical entries.
   */
  async settle(id: string, userId?: string): Promise<Project | null> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * Legacy release endpoint: align target amount with actual spent amount and mark settled.
   */
  async release(id: string, userId?: string): Promise<Project | null> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.targetAmount = project.spentAmount;
    project.status = 'settled';
    return await this.projectRepository.save(project);
  }

  /**
   * Permanently delete a project card owned by the current user.
   */
  async remove(id: string, userId?: string): Promise<{ success: boolean }> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.projectRepository.remove(project);
    return { success: true };
  }

  /**
   * Update accumulated spent amount on a project card.
   */
  async updateSpentAmount(
    id: string,
    spentAmount: number,
    userId?: string,
  ): Promise<Project | null> {
    if (!userId) {
      throw new UnauthorizedException('User ID required');
    }
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.spentAmount = spentAmount;
    return await this.projectRepository.save(project);
  }

  /**
   * Update project settings, entries array, or status; recalculates spentAmount from entries when provided.
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId?: string,
  ): Promise<Project> {
    if (!userId) throw new UnauthorizedException('User ID required');
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');

    if (updateProjectDto.title !== undefined) {
      project.title = updateProjectDto.title;
    }
    if (updateProjectDto.targetAmount !== undefined) {
      project.targetAmount = updateProjectDto.targetAmount;
    }
    if (updateProjectDto.status !== undefined) {
      project.status = updateProjectDto.status;
    }
    if (updateProjectDto.includeInBudget !== undefined) {
      project.includeInBudget = updateProjectDto.includeInBudget;
      project.mode = updateProjectDto.includeInBudget ? 'budget_deduct' : 'extra';
    }
    if (updateProjectDto.timeframeType !== undefined) {
      project.timeframeType = updateProjectDto.timeframeType;
    }
    if (updateProjectDto.startDate !== undefined) {
      project.startDate = updateProjectDto.startDate;
    }
    if (updateProjectDto.deadline !== undefined) {
      project.deadline = updateProjectDto.deadline;
    }

    if (updateProjectDto.entries !== undefined) {
      const normalizedEntries: ProjectEntryItem[] = updateProjectDto.entries.map(
        (e) => ({
          id: e.id,
          title: e.title || '',
          category: e.category || 'Other Expense',
          account_name: e.account_name || 'Cash',
          amount: Number((Number(e.amount) || 0).toFixed(2)),
          date: e.date,
          image_url: e.image_url ?? null,
          image_size_kb: Number(e.image_size_kb) || 0,
          created_at: e.created_at || new Date().toISOString(),
        }),
      );
      project.entries = normalizedEntries;
      project.spentAmount = Number(
        normalizedEntries.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
      );
    } else if (updateProjectDto.spentAmount !== undefined) {
      project.spentAmount = updateProjectDto.spentAmount;
    }

    return await this.projectRepository.save(project);
  }

  /**
   * Resume a completed ('settled') project card back to 'active' status.
   */
  async resume(id: string, userId?: string): Promise<Project> {
    if (!userId) throw new UnauthorizedException('User ID required');
    const project = await this.projectRepository.findOne({
      where: { id, userId },
    });
    if (!project) throw new NotFoundException('Project not found');
    project.status = 'active';
    return await this.projectRepository.save(project);
  }
}
