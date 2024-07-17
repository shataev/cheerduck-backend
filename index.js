const fs = require('fs');
const docx = require('docx');
const {PatchType} = require("docx");
const { patchDocument, Document, Packer, Paragraph, TextRun } = docx;

// Функция для чтения и заполнения шаблона
async function fillTemplate(data) {
    // Прочитать шаблонный файл
    const template = fs.readFileSync('./templates/receipt.docx');


    patchDocument(template, {
        patches: {
            // Заменить закладки данными
            name: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.name)]
            },
            date: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.date)]
            },
            passport: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.passport)]
            },
            address: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.address)]
            },
            total: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.total)]
            },
            deposit: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.deposit)]
            },
            price: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.price)]
            },
            electricity: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.electricity)]
            },
            checkOutDate: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.checkOutDate)]
            },
            checkInDate: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun(data.checkInDate)]
            },
        }
    }).then((doc) => {
        fs.writeFileSync(`Cheerducksdvsdvdsvdsvds_${data.name}.docx`, doc);
    });

    // Заменить закладки данными
    //doc.replaceText("{NAME}", data.name);
/*    doc.replaceText("{DATE}", data.date);
    doc.replaceText("{ADDRESS}", data.address);
    doc.replaceText("{PASSPORT}", data.passport);
    doc.replaceText("{CHECK_IN_DATE}", data.checkInDate);
    doc.replaceText("{CHECK_OUT_DATE}", data.checkOutDate);
    doc.replaceText("{ELECTR}", data.electricity);
    doc.replaceText("{PRICE}", data.price);
    doc.replaceText("{DEPOSIT}", data.deposit);
    doc.replaceText("{TOTAL}", data.total);*/

    // Сохранить заполненный документ
    //const buffer = await Packer.toBuffer(doc);
    //fs.writeFileSync('filled-check.docx', buffer);
}

// Пример данных для заполнения
const data = {
    name: 'Mr. Nekto',
    checkInDate: '01.01.2021',
    date: '01.01.2021',
    address: '101',
    passport: '1122334455',
    checkOutDate: '01.02.2021',
    electricity: '0871',
    price: '6000',
    deposit: '6000',
    total: '12000',
};

// Заполнить шаблон данными
fillTemplate(data).then(() => {
    console.log('Шаблон успешно заполнен!');
});
