export const __prod__ = () => !!(process.env.NODE_END === 'production');
export const __test__ = () => !!(process.env.NODE_END === 'test');
