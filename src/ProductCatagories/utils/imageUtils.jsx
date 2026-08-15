const images = import.meta.glob(
  "../../assets/sub_categories/*",
  { eager: true, import: "default" }
);

export const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http')) return imageName;
  
  // Try to find the matching key from the glob import
  const matchingKey = Object.keys(images).find(key => key.includes(imageName));
  return matchingKey ? images[matchingKey] : null;
};