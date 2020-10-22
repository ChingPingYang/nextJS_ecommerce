import Product from '../models/Product';
import connectDB from '../utils/connectDb';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';

function Home({products, totalPages}) {
  return (
    <>
      {products && 
      <>
        <ProductList products={products} />
        <ProductPagination totalPages={totalPages} />
      </>}
    </>
  )
}

export async function getServerSideProps(ctx) {
  const page = Number(ctx.query.page) || 1;
  const size = 9;
  await connectDB();
  let products = [];
  const totalDocs = await Product.countDocuments({ deleted: false});
  const totalPages = Math.ceil(totalDocs / size);
  try {
    if(page === 1) {
       products = await Product.find({ deleted: false}).limit(size);
    } else {
      const skips = size * (page - 1);
      products = await Product.find({ deleted: false}).skip(skips).limit(size);
    }
    return {
      props: {
        // Needs to stringify and then parse... https://github.com/vercel/next.js/issues/11993
        products: JSON.parse(JSON.stringify(products)),
        totalPages
      }
    }
  }catch(err) {
    console.log('err???:',err)
  }
}

export default Home;
