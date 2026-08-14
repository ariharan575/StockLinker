// Adjust the relative path to your assets folder if needed
const images = import.meta.glob(
  "../../../assets/subcategories/*",
  { eager: true, import: "default" }
);

export const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  
  // Try to find the matching key from the glob import
  const matchingKey = Object.keys(images).find(key => key.includes(imageName));
  return matchingKey ? images[matchingKey] : null;
};