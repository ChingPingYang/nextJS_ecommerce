import Product from '../models/Product';
import connectDB from '../utils/connectDb';
import ProductList from '../components/Index/ProductList';

function Home({products}) {
  return (
    <>
      {products && <ProductList products={products} />}
    </>
  )
}

export async function getStaticProps() {
  await connectDB();
  try {
    const products = await Product.find();
    return {
      props: {
        // Needs to stringify and then parse... https://github.com/vercel/next.js/issues/11993
        products: JSON.parse(JSON.stringify(products))
      }
    }
  }catch(err) {
    console.log('err???:',err)
  }
}

export default Home;
