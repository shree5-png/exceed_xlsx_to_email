
export const notFound = (err, req, res) => {

    res.status(404).json({ Title: "ERROR: NOT FOUND", Message: `Route doesnot Exist ${err.message}` });
}

