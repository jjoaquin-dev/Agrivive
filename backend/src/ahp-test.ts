import {  all, create } from "mathjs";

//AHP

/*Define Criteria
1.Posting age(freshness)	
2.Price/kg(dropped)	
3.Stock_level	
4.seller_reliability	
	*/

const math = create(all)

//define points using saatys scale
const matrix:number[][] = [[1,1,2,3],
                [1,1,2,3],
                [1/2,1/2,1,2],
                [1/3,1/3,1/2,1]]

export async function get_criteria_weights():Promise<number[]>{



//get sum of each column
const sum_matrix = math.sum(matrix,0)


//ratio of each column by the sum of each column
const normalized_matrix = math.dotDivide(matrix,sum_matrix)

//get criteria_weights

const criteria_weights = math.mean(normalized_matrix,1).valueOf() as unknown as number[]

return criteria_weights;

}

const criteria_weights = await get_criteria_weights()

//check consistency
const get_weighted_sum_value = math.multiply(matrix,criteria_weights) 

const ratio = math.dotDivide(get_weighted_sum_value,criteria_weights)

const lamda_max = math.mean(ratio)

const consistency_index = (lamda_max-matrix.length)/(matrix.length-1)

const consistency_ratio = (consistency_index/0.90)

console.log("Weighted Sum Vector:",math.format(get_weighted_sum_value,{
    notation: 'fixed',
    precision:4
}))

console.log("Criteria Weights:",math.format(criteria_weights,{
    notation: 'fixed',
    precision:4
}))



console.log("Ratio:",math.format(ratio,{
    notation: 'fixed',
    precision:4
}))

console.log("Lambda Max:",math.format(lamda_max,{
    notation: 'fixed',
    precision:4
}))

console.log("Consistency Index:",math.format(consistency_index,{
    notation: 'fixed',
    precision:4
}))

console.log("Consistency Ratio:",math.format(consistency_ratio,{
    notation: 'fixed',
    precision:4
}))

console.log(`The consistency ratio ${math.format(consistency_ratio,{
    notation: 'fixed',
    precision:4
})} <= 0.10 which is standard, Therefore`,math.format(criteria_weights,{
    notation: 'fixed',
    precision:4
}),"can be used for TOPSIS weighing")