const getClientColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = hash % 360;
    return { hue };
  };

  export default getClientColor;