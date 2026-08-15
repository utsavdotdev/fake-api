import { source } from '@/lib/source';
import { openapi } from '@/lib/openapi';
import { getMDXComponents } from '@/components/mdx';
import { OpenAPIPage } from '@/components/api-page';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await props.params;
  const page = source.getPage(slug);

  if (!page) {
    return null;
  }

  const MdxContent = page.data.body;

  return (
    <MdxContent
      components={getMDXComponents({
        OpenAPIPage: async (props) => (
          <OpenAPIPage {...(await openapi.preloadOpenAPIPage(page))} {...props} />
        ),
      })}
    />
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}
