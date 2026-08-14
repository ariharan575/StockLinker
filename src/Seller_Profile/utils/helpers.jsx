// Adjust the relative path to your assets folder if needed
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

export const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hourString, minute] = timeStr.split(':');
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${minute} ${ampm}`;
};