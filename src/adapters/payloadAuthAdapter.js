/** @return { import("next-auth/adapters").Adapter } */
export function PayloadAuthAdapter(client, options = {}) {
  return {
    async createUser(user) {
      return
    },
    async getUser(id) {
      return
    },
    async getUserByEmail(email) {
      return
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return
    },
    async updateUser(user) {
      return
    },
    async deleteUser(userId) {
      return
    },
    async linkAccount(account) {
      return
    },
    async unlinkAccount({ providerAccountId, provider }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      return
    },
    async getSessionAndUser(sessionToken) {
      return
    },
    async updateSession({ sessionToken }) {
      return
    },
    async deleteSession(sessionToken) {
      return
    },
    //
    // // These functions are required to support email passwordless sign in... going to skip for now.
    //
    // async createVerificationToken({ identifier, expires, token }) {
    //   return
    // },
    // async useVerificationToken({ identifier, token }) {
    //   return
    // },
  }
}