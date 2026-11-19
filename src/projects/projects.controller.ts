import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

/**
 * ProjectsController
 * Exposes RESTful endpoints for managing Dedicated Project Budget Cards under '/api/projects'.
 */
@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * GET /api/projects - Retrieve all project cards for the current user.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all dedicated project cards' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async findAll(@Headers('x-user-id') userId?: string) {
    return await this.projectsService.findAll(userId);
  }

  /**
   * POST /api/projects - Create a new project card.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new project card' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.projectsService.create(createProjectDto, userId);
  }

  /**
   * PATCH /api/projects/:id/settle - Mark a project card as completed.
   */
  @Patch(':id/settle')
  @ApiOperation({ summary: 'Complete and archive a project card' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async settle(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.projectsService.settle(id, userId);
  }

  /**
   * PATCH /api/projects/:id/resume - Resume a completed project card back to active.
   */
  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume a completed project back to active' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async resume(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.projectsService.resume(id, userId);
  }

  /**
   * PATCH /api/projects/:id/release - Legacy endpoint aligning target with spent amount.
   */
  @Patch(':id/release')
  @ApiOperation({ summary: 'Release remaining unspent funds to budget' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async release(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.projectsService.release(id, userId);
  }

  /**
   * PATCH /api/projects/:id/spent - Update accumulated spent amount of a project card.
   */
  @Patch(':id/spent')
  @ApiOperation({ summary: 'Update accumulated spent amount of a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async updateSpent(
    @Param('id') id: string,
    @Body('spentAmount') spentAmount: number,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.projectsService.updateSpentAmount(
      id,
      Number(spentAmount),
      userId,
    );
  }

  /**
   * PATCH /api/projects/:id - Update project settings, entries, and status.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update project settings, entries and status' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.projectsService.update(id, updateProjectDto, userId);
  }

  /**
   * DELETE /api/projects/:id - Permanently delete a project card.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project card' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async remove(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.projectsService.remove(id, userId);
  }
}
