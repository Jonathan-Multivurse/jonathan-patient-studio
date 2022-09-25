import fetch from 'cross-fetch'
import taxRates from './data/taxRate.json'

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles() {
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  const texts: string[] = await Promise.all(urls.map(url => 
    fetch(url, { method: 'GET' }).then(res => res.text())
  ))

  return texts.map(text => (text.match(/<title>(.*?)<\/title>/) || [])[1])
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */

export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tagCountsObj = localData.reduce((result: { [index: string]: number }, item) => {
    for (let tag of item.tags) {
      result[tag] = result[tag] || 0
      result[tag]++
    }
    return result
  }, {})

  return Object.entries(tagCountsObj).map(([tag, count]): TagCounts => ({ tag, count }))
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates
 * the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */

export function calcualteImportCost(importedItems: Array<ImportedItem>): Array<ImportCostOutput> {
  // please write your code in here.
  // note that `taxRate` has already been imported for you

  const res = importedItems.map(item => {
    const { name, quantity, unitPrice, countryDestination } = item
   
    const taxObject: ImportTaxRate | undefined = taxRates.find(r => r.country === countryDestination)
    const tax = taxObject?.categoryExceptions.includes(item.category) ? 0 : taxObject?.importTaxRate || 0
   
    const subtotal = unitPrice * quantity
    const importCost = subtotal * tax
    const totalCost = importCost + subtotal

    return { name, subtotal, importCost, totalCost }
  })
  return res;
}
