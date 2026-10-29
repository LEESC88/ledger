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
   * 1. GET /api/projects - 获取当前用户所有专款项目
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all sinking funds / projects' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async findAll(@Headers('x-user-id') userId?: string) {
    return await this.projectsService.findAll(userId);
  }

  /**
   * 2. POST /api/projects - 创建新专款
   */
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiHeader({ name: 'x-user-id', required: false })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return await this.projectsService.create(createProjectDto, userId);
  }

  /**
   * 3. PATCH /api/projects/:id/settle - 专款结案平账
   */
  @Patch(':id/settle')
  @ApiOperation({ summary: 'Settle and close a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async settle(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.projectsService.settle(id, userId);
  }

  /**
   * 4. PATCH /api/projects/:id/release - 提前释放结余资金回预算
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
   * 5. DELETE /api/projects/:id - 撤销 / 删除专款
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel/delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  async remove(@Param('id') id: string, @Headers('x-user-id') userId?: string) {
    return await this.projectsService.remove(id, userId);
  }

  /**
   * 6. PATCH /api/projects/:id/spent - 更新专款已消耗金额
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
    return await this.projectsService.updateSpentAmount(id, Number(spentAmount), userId);
  }
}
