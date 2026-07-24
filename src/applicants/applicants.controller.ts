import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { CreateApplicantDto } from './dto/create-applicant.dto';
import { UpdateApplicantDto } from './dto/update-applicant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindApplicantsDto } from './dto/find-applicants.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateNotesDto } from './dto/update-notes.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Applicants')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new applicant' })
  create(@Body() createApplicantDto: CreateApplicantDto) {
    return this.applicantsService.create(createApplicantDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List and filter active applicants with pagination',
  })
  findAll(@Query() query: FindApplicantsDto) {
    return this.applicantsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single applicant' })
  findOne(@Param('id') id: string) {
    return this.applicantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update generic applicant data (excludes status/notes)',
  })
  update(
    @Param('id') id: string,
    @Body() updateApplicantDto: UpdateApplicantDto,
  ) {
    return this.applicantsService.update(id, updateApplicantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an applicant' })
  remove(@Param('id') id: string) {
    return this.applicantsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Transition applicant status (state machine protected)',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.applicantsService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Overwrite applicant internal notes' })
  updateNotes(@Param('id') id: string, @Body() updateNotesDto: UpdateNotesDto) {
    return this.applicantsService.updateNotes(id, updateNotesDto);
  }
}
