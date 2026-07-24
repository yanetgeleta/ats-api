import { validate } from 'class-validator';
import { UpdateNotesDto } from './update-notes.dto';

describe('UpdateNotesDto (Validation)', () => {
  it('should pass validation if notes are exactly 1000 characters', async () => {
    const dto = new UpdateNotesDto();
    dto.notes = 'a'.repeat(1000);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if notes exceed 1000 characters', async () => {
    const dto = new UpdateNotesDto();
    dto.notes = 'a'.repeat(1001);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
