import AuthRepository from '@/repositories/auth'

class AuthService {
    async getUserById(studentId: string) {
        return AuthRepository.findById(studentId)
    }

    async getUserByEmail(email: string) {
        return AuthRepository.findByEmail(email)
    }

    async getAllUsers({ offset, limit }: { offset: number, limit: number}) {
        return AuthRepository.find({ offset, limit })
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

    async setTheme(id: string, theme: "DARK" | "LIGHT") {
        return AuthRepository.setTheme(id, theme)
    }

    async toggleRole(id: string, role: "USER" | "MODERATOR") {
        return AuthRepository.setRole(id, role)
    }

    async updatePassword(id: string, password: string) {
        return AuthRepository.updatePassword(id, password)
    }

    async deleteUser(id: string) {
        return AuthRepository.delete(id)
    }
}

export default new AuthService()