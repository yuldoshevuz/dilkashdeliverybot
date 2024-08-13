import bot from "../core/bot.js";

const getImageUrl = async (photo) => {
    try {
        if (photo) {
            const lastItem = photo[ photo.length - 1 ];
            const imageLink = await bot.telegram.getFileLink(lastItem.file_id);
    
            if (imageLink?.href) {
                return imageLink.href;
            }
        }
    } catch (error) {
        return null;
    }

    return null;
}

export default getImageUrl;