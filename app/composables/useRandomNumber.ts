export const useRandomNumber = (inclusive_lower: number, inclusive_upper: number) => {
    return Math.floor(Math.random() * (inclusive_upper - inclusive_lower + 1) + inclusive_lower);
}