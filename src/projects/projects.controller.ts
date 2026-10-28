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

/**
 * ProjectsController
 * Exposes RESTful endpoints for managing Sinking Funds & Projects under '/api/projects'.
 */
@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * ============================================================================
   * 1. GET /api/projects - 获取当前用户所有专款项目
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 从请求头接收 @Headers('x-user-id') userId?: string
   * 2. 调用 projectsService.findAll(userId) 并返回结果:
   *      return await this.projectsService.findAll(userId);
   * ============================================================================
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all sinking funds / projects' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async findAll(@Headers('x-user-id') userId?: string) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.projectsService.findAll(userId);
  }

  /**
   * ============================================================================
   * 2. POST /api/projects - 创建新专款
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Body() createProjectDto: CreateProjectDto
   * 2. 接收 @Headers('x-user-id') userId?: string
   * 3. 调用 service 创建:
   *      return await this.projectsService.create(createProjectDto, userId);
   * ============================================================================
   */
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Headers('x-user-id') userId?: string,
  ) {
    // ✍️ YOUR TURN: Write your code below this line:

    return await this.projectsService.create(createProjectDto, userId);
  }

  /**
   * ============================================================================
   * 3. PATCH /api/projects/:id/settle - 专款结案平账
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 接收 @Headers('x-user-id') userId?: string
   * 3. 调用 service 结案:
   *      return await this.projectsService.settle(id, userId);
   * ============================================================================
   */
  @Patch(':id/settle')
  @ApiOperation({ summary: 'Settle and close a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async settle(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.projectsService.settle(id, userId);
  }

  /**
   * ============================================================================
   * 4. PATCH /api/projects/:id/release - 提前释放结余资金回预算
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 调用 service 释放结余:
   *      return await this.projectsService.release(id, userId);
   * ============================================================================
   */
  @Patch(':id/release')
  @ApiOperation({ summary: 'Release remaining unspent funds to budget' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async release(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.projectsService.release(id, userId);
  }

  /**
   * ============================================================================
   * 5. DELETE /api/projects/:id - 撤销 / 删除专款
   * ============================================================================
   * STEP-BY-STEP IMPLEMENTATION HINTS:
   * 1. 接收 @Param('id') id: string
   * 2. 调用 service 删除:
   *      return await this.projectsService.remove(id, userId);
   * ============================================================================
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel/delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async remove(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    // ✍️ YOUR TURN: Write your code below this line:
    return await this.projectsService.remove(id, userId);
  }
}
