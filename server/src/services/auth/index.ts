import AuthRepository from '@/repositories/auth'

class AuthService {
    async getUserById(studentId: string) {
        return AuthRepository.findById(studentId)
    }

    async getUserByEmail(email: string) {
        return AuthRepository.findByEmail(email)
    }

    async createUser(studentId: string, name: string, password: string) {
        return AuthRepository.create({ id: studentId, name: name, password: password})
    }

    async createPasswordlessUser(id: string, name: string, email: string) {
        return AuthRepository.create({ id, email, name, password: "" })
    }

    async bindEmailToUser(userId: string, email: string) {
        return AuthRepository.bindEmail(userId, email)
    }
}

export default new AuthService()