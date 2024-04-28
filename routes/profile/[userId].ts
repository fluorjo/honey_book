export { default } from '@/app/(tabs)/profile/page';
export async function loader({ params }) {
  return { props: { userID: parseInt(params.userID) } };
}