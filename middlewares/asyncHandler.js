
export const asynceHandler = (req, res, next) => {
    return Promise.resolve(req, res, next).catch(next);
}