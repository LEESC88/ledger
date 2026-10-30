import { PartialType } from '@nestjs/swagger';
import { CreateRecordDto } from './create-record.dto.js';

/**
 * Data Transfer Object for updating an existing ledger record.
 * Inherits all validation rules from CreateRecordDto with all fields optional.
 */
export class UpdateRecordDto extends PartialType(CreateRecordDto) {}
