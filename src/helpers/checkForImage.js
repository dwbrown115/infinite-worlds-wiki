function checkForImage(array) {
  array.map((item) => {
    {
      item.content.map((item) => {
        // console.log(item)
        {
          item.content.map((item) => {
            if (item.sectionImage !== "") {
              return true;
              // console.log("image exists")
            } else {
              return false;
              // console.log("image doesn't exist")
            }
          });
        }
      });
    }
  });
}

export default checkForImage;
