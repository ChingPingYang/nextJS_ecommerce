import connectDB from '../../utils/connectDb';
import Product from '../../models/Product';

import ProductSummary from '../../components/Product/ProductSummary';
import ProductAttributes from '../../components/Product/ProductAttributes';

const ProductPage = ({ product , state}) => {
    
    return (
        <>
            <ProductSummary {...product} user={state.user}/>
            <ProductAttributes {...product} user={state.user}/>
        </>
    )
}

export const getStaticPaths = async () => {
    connectDB()
    try {
        const products = await Product.find();
        const paths = products.map(p => ({params: {product: p._id.toString()}}));
        return {
            paths,
            fallback: true
        }
    } catch(err) {
        console.log('Err at getStaticPaths');
    }
}

export const getStaticProps = async (ctx) => {
    const { product: id } = ctx.params;
    try {
        const product = await Product.findById(id);
        return {
            props: {
                product: JSON.parse(JSON.stringify(product))
            }
        }
    } catch(err) {
        console.log('Err at getStaticProps');
        return {
            props: {
                product: ""
            }
        }
    }
}

export default ProductPage;