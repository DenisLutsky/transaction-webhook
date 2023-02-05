import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete } from '@nestjs/common';

import { AuthGuard } from 'shared/guards';
import { CustomRequest } from 'shared/interfaces';
import { Category } from '../interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { CategoryService } from '../services';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  @Post()
  public async createTransaction(@Req() { user }: CustomRequest, @Body() input: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.createCategory(input, user);
  }

  @Get(':id')
  public async findCategory(@Req() { user }: CustomRequest, @Param('id') categoryId: string): Promise<Category> {
    return await this.categoryService.findOneById(+categoryId, user);
  }

  @Get()
  public async findAllCategory(@Req() { user }: CustomRequest): Promise<Category[]> {
    return await this.categoryService.findAllCategoryForUser(user);
  }

  @Patch(':id')
  public async updateCategory(
    @Req() { user }: CustomRequest,
    @Param('id') id: string,
    @Body() input: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(+id, input, user);
  }

  @Delete(':id')
  public async deleteCategory(@Req() { user }: CustomRequest, @Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategory(+id, user);
  }
}
