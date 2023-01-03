const { faker } = require('@faker-js/faker');
const fs = require("fs");


faker.setLocale('vi')

const randomCategoryList = (n) => {
    if( n<= 0) return [];
    
    const categoriesList = [];

    Array.from(new Array(n)).forEach(() => {
        const category = {
            id: faker.datatype.uuid(),
            name: faker.name.fullName(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        categoriesList.push(category);
    });

    return categoriesList;
}

const randomProductList = (categoryList, numberOfProducts) => {
   
    if(numberOfProducts <= 0) return [];
    
    const productList = [];

    //random data
    for(const category of categoryList){
        Array.from( new Array(numberOfProducts)).forEach(() => {
            const product = {
                categoryId: category.id,
                id : faker.datatype.uuid(),
                name: faker.commerce.productName(),
                price: Number.parseFloat(faker.commerce.price()) ,
                description: faker.commerce.productDescription(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                thumbnailUrl: faker.image.imageUrl(300,300),
            }
          

            productList.push(product);
            
        })
    }

    return productList;
};

// IFFE
(() => {
    //random data
    const categoryList = randomCategoryList(4);
    const productList = randomProductList (categoryList, 5);

    // prepare db object
    const db = {
        categories: categoryList,
        products: productList,
        profile: {
            name: "Pho",
        },
    };

    //wirte db object to db.json
    fs.writeFile('db.json', JSON.stringify(db), () => {
        console.log("Generate date successfully ");
    });

})()