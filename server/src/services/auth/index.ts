import AuthRepository from '@/repositories/auth'

class AuthService {
    async getUserById(studentId: string) {
        return AuthRepository.findById(studentId)
    }

    async createUser(studentId: string, name: string, password: string) {
        return AuthRepository.create({ id: studentId, name: name, password: password})
    }
}

export default new AuthService()