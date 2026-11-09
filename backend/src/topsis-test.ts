
import { alias } from "drizzle-orm/pg-core";
import { db } from "./db";
import { order_reviews, sellers_product } from "./db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { all, create} from "mathjs";
import { get_criteria_weights } from "./ahp-test";



/*Define Criteria
1.Posting age(freshness)	
2.Price/kg(dropped)	
3.Stock_level	
4.seller_reliability	
*/

const math = create(all)

export async function get_criteria() {

    const sp = alias(sellers_product,"sp")
    const pr = alias(order_reviews,"pr")
    
    const criteria = await db.select({
        product_id: sp.id,
        seller_id: sp.userId,
        product_name: sp.productName,
        posting_age: sql<number>`
                EXTRACT(HOUR FROM ${sp.createdAt})
        `,
        deducted_price: sql<number>`${sp.basePrice}-${sp.productPrice}`,
        stock_level: sp.productQty,
        seller_reliability: sql<number>`COALESCE(AVG(${pr.rating}), 0)`,
    }).from(sp)
    .leftJoin(pr,eq(sp.userId,pr.sellerId))
    .groupBy(sp.id,sp.userId,sp.productName,sp.createdAt,sp.basePrice,sp.productPrice,sp.productQty)
    .where(eq(sp.userId,"HVZYGqepZcVtiqSkq7lnNjF7jjHKpETO"))
    // .where(and(
    //     eq(sp.userId,"dd8zbZRLIncysY0Uly2EWiYUAwt6ZV3T"),
    //     or(eq(sp.id,"37a1318b-9f1d-4f24-9810-35e87e41401a"),//kalabasa
    //         eq(sp.id,"93820f2d-9a14-4e08-9422-3fa63c203fe9"),//karot
    //         eq(sp.id,"c7861323-7dbb-4e4e-9479-e8a0b83e2b76"))//sigraliyas
    // ) )

    if(!criteria) throw new Error("criteria not found!")

    return criteria
}



const criterias = await get_criteria();
const criteria_weights = await get_criteria_weights()


const pairwise_matrix:number[][] = criterias.map((ctr)=>[
    ctr.posting_age,
    ctr.deducted_price,
    ctr.stock_level,
    ctr.seller_reliability
].map(Number))


//normalized matrix
const powered_matrix = math.sum(
    math.dotPow(pairwise_matrix, 2),
    0
).valueOf() as unknown as number[];

const denominator = powered_matrix.map((pm)=> math.sqrt(pm) || 1) // a column of all zeros would give 0/0 = NaN
const normalized_matrix = math.dotDivide(pairwise_matrix,denominator)


//get criterion weighted values
const weight_of_criterion = math.dotMultiply(normalized_matrix,criteria_weights)



//get distance to ideal best
const ideal_best = math.max(weight_of_criterion,0)
const subtract_best = math.subtract(weight_of_criterion,ideal_best)
const powered_best = math.dotPow(subtract_best,2) as number[][]
const summed_best = math.sum(powered_best,1).valueOf() as unknown as number[]
const distance_to_ideal_best = summed_best.map((value)=> math.sqrt(value))



//get distance to ideal worst
const ideal_worst = math.min(weight_of_criterion,0)
const subtract_worst = math.subtract(weight_of_criterion,ideal_worst)
const powered_worst = math.dotPow(subtract_worst,2) as number[][]
const summed_worst = math.sum(powered_worst,1).valueOf() as unknown as number[]
const distance_to_ideal_worst = summed_worst.map((value)=> math.sqrt(value))


//get closeness coefficient

const sum_distances = math.add(distance_to_ideal_best,distance_to_ideal_worst)
const closeness_coefficient = distance_to_ideal_worst.map((worst,i)=> Number(sum_distances[i]) === 0 ? 0 : Number(worst) / Number(sum_distances[i]))

const ranking_products = criterias.map((crt,index)=>({
    ...crt,
    score: closeness_coefficient[index]

}))



console.log(criterias)
// console.log(criteria_weights)
// console.log(pairwise_matrix)
// console.log(powered_matrix)
// console.log(denominator)
// console.log(normalized_matrix)
// console.log(weight_of_criterion)
// console.log(ideal_best)
// console.log(ideal_worst)
// console.log(subtract_best)
// console.log(summed_best)
console.log(distance_to_ideal_best)
console.log(distance_to_ideal_worst)
console.log(sum_distances)
console.log(closeness_coefficient)
console.log(ranking_products)
