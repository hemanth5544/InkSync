const GetUserAvatar = function (seed) {
    return `https://api.dicebear.com/8.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
};

module.exports = {
    GetUserAvatar
}