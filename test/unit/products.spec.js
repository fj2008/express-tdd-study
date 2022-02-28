const productController = require('../../controller/products');
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');
const Product = require('../../models/Product');
// jest.fn()
// 위함수는 단순히 가짜함수를 만드는 것이 아니라 해당 함수와 연결돼서 얼마나 호출이 됐는지 어떤인자와 호출이 됐는지 등
// 계속 탐색을 해주기때문에 사용하려는 함수를 테스트할때는 아래와같이 등록해서 테스트를 해야한다. 아니면 expect와 matcher가 잘 안먹는다.
productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();
const productId = '621b08ccf162ac1b6647a966';
const updatedProduct = { name: 'updqted name', description: 'updqted description' };
let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Product Controller Create', () => {
    beforeEach(() => {
        req.body = newProduct;
    });
    it('should have a createProduct funtion', () => {
        expect(typeof productController.createProduct).toBe('function');
    });
    it('should call ProductModel.create', async () => {
        await productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(newProduct);
    });
    it('should return 201 response code', async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in resposne', async () => {
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });
    it('should handle errors', async () => {
        const errorMessage = { message: 'description property missing' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('Product Controller Get', () => {
    it('should have a getProducts function', () => {
        expect(typeof productController.getProducts).toBe('function');
    });
    it('should for productModel.find({})', async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    });
    it('should return 200 response', async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });
    it('should return json body in response', async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });
    it('should handle errors', async () => {
        const errorMessage = { message: 'error finding product data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('product Controller GetById', () => {
    it('should have a getProductById', async () => {
        expect(typeof productController.getProductById).toBe('function');
    });
    it('should call productModel.findById', async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });
    it('should return json body and response code 200', async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct); // 어떤 json데이트를 받나면 toStrictEqual의 json데이터가 옵니다.
        expect(res._isEndCalled).toBeTruthy();
    });
    it('should return 404 when item doesnt exist', async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should handle errors', async () => {
        const errorMessage = { message: 'error' };
        const rejectPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Product Controller Update', () => {
    it('should have an updateProduct function', () => {
        expect(typeof productController.updateProduct).toBe('function');
    });

    it('should call productModel.findByIdAndUpdate', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, { name: 'updqted name', description: 'updqted description' }, { new: true });
    });

    it('should return json body and response code 200', async () => {
        req.params.productId = productId;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    it('should handle 404 when item doent exist', async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy;
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'error' };
        const rejectPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('Product Controller Delete', () => {
    it('should have a deleteProduct function', () => {
        expect(typeof productController.deleteProduct).toBe('function');
    });
    it('should call ProductModel.findByIdAndDelete', async () => {
        req.params.productId = productId;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    });
    it('should return 200 response', async () => {
        let deletedProduct = {
            name: 'deletedProduct',
            description: 'it is deleted',
        };
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should handle 404 when item doenst exitst', async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it('should handle errors', async () => {
        const errorMessage = { message: 'error' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});
