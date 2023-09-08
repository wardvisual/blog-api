import { User } from '@/modules/users/entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';

export class RegisterDto extends OmitType(User, ['id']) {}
