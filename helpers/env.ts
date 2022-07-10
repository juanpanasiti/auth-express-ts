export const isDevEnv = ():boolean => {
    return process.env.ENVIRONMENT === 'dev'
}
