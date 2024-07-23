


export const sendEmail = async (to,subject,htmlContent) => {
    const data = {
        from: 'bananePiccanti <noreply@yourdomain.com>',
        to,
        subject,
        html: htmlContent
    };
    try {
        const response = await mg.messages().send(data);
        console.log('email inviata con sul cesso', response);
        return response;
    }catch(err){
        console.error('errore mongolo', err);
        throw err;
    }
}
