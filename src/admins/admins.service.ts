import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {AdminsRepository} from "./admins.repository";
import bcrypt from 'bcrypt';
import {CreateAdminDto} from "./dto/createAdmin.dto";

@Injectable()
export class AdminsService {
    constructor(private adminsRepository: AdminsRepository) {
    }

    private readonly logger = new Logger(AdminsService.name);

    async login(createAdminDto: CreateAdminDto) {
        const {email, password} = createAdminDto;

        this.logger.log(`Trying to login admin by email: ${email}`);

        const result = await this.adminsRepository.findOneByEmail(email);
        if (!(<any>result).length) {
            this.logger.log(`admin with email: ${email} not found`)
            throw new HttpException('user not exist', HttpStatus.UNAUTHORIZED);
        }
        const adminPassword = result.password;
        const user = result;
        const isValidPassword = await bcrypt.compare(password, adminPassword);
        if (!isValidPassword) {
            this.logger.log(`admin with this password not found`)
            throw new HttpException('password is not valid', HttpStatus.UNAUTHORIZED);
        }

        this.logger.log(`Successfully find admin by email: ${email}`);

        return user;
    }

    async logout(id: number) {
        this.logger.log(`Trying to find admin by id: ${id}`);
        const user = await this.adminsRepository.findOneById(id);

        if (!(<any>user).length) {
            this.logger.log(`admin with id: ${id} not found`)
            throw new HttpException('admin not exist', HttpStatus.NOT_FOUND);
        }

        this.logger.log(`Successfully find admin by id: ${id}`)
        return {
            message: 'Success',
        };
    }
}
