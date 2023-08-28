import axios from "axios";
import config from "../config.js";

const axiosInstance = axios.create({
    baseURL: config.url,
});

const addBook = async ({userId}, token, bookData) => {
    const response = await axiosInstance({
        method: 'POST',
        url: '/BookStore/v1/Books',
        headers: { Authorization: `Bearer ${token}` },
        data: {
            userId: userId,
            collectionOfIsbns: [
                {
                    isbn: bookData.isbn,
                }
                ]
        }
    })
    return response;
}

const updateBook = async (isbn, updateData, token) => {
    const response = await axiosInstance({
        method: 'PUT',
        url: `/BookStore/v1/Books/${isbn}`,
        headers: { Authorization: `Bearer ${token}` },
        data: updateData
    })
    return response;
}

const getBook = async ({isbn}) => {
    const response = await axiosInstance({
        method: 'GET',
        url: '/BookStore/v1/Book',
        params: { ISBN: isbn }
    })
    return response;
}

const deleteBook = async ({userId}, {isbn}, token) => {
    const response = await axiosInstance({
        method: 'DELETE',
        url: '/BookStore/v1/Book',
        headers: { Authorization: `Bearer ${token}` },
        data: {
            isbn: isbn,
            userId: userId
        }
    })
    return response;
}

export { addBook, updateBook, getBook, deleteBook };
