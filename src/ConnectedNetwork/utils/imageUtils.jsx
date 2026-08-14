// Adjust this relative path so it points to your actual assets folder
const subcategoryImages = import.meta.glob(
  "../../../assets/subcategories/*", 
  { eager: true, import: "default" }
);

export const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http') || imageName.startsWith('data:')) return imageName;
  
  const matchingKey = Object.keys(subcategoryImages).find(key => key.includes(imageName));
  return matchingKey ? subcategoryImages[matchingKey] : null;
};