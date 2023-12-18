import {createObjectCsvWriter} from 'csv-writer'

export const saveData = async(data) => {
    const csvWriter = createObjectCsvWriter({
        path: '../parcing/data/result.csv',
        header: [
            {id: 'title', title: 'НАИМЕНОВАНИЕ'},
            {id: 'price', title: 'ЦЕНА'}
        ]
    });

    await csvWriter.writeRecords(data)
}