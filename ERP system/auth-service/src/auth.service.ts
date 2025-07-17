import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.userRepository.findOne({ where: [{ username }, { email }] });
    if (existing) throw new ConflictException('Username or email already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, email, password: hash });
    await this.userRepository.save(user);
    return { id: user.id, username: user.username, email: user.email };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async validateJwtPayload(payload: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
} 