const convertMediaGroup = (images) => images?.map((image) => ({
    type: "photo",
    media: image
})) || [];

export default convertMediaGroup;