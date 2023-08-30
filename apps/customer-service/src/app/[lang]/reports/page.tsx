import { useTranslation } from '~/app/i18n';

export default async function ReportsPage ({ params: { lang } }: { params: { lang: string } }) {
  const { t } = await useTranslation(lang);
  return <main className="py-10 lg:pl-60">
  <div className="px-4 sm:px-6 lg:px-8">
    {t('layout.reports')}
  </div>
</main>
}

ReportsPage.displayName = 'ReportsPage';
