import ApplicationForm from "@/components/parts/join/ApplicationForm"

const ApplicationFormSection = () => {
  return (
    <div className="flex flex-col items-center px-4 md:px-16 py-16">
      <div className="text-center mb-5">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">応募フォーム</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Propositio AIに興味を持っていただきありがとうございます。以下のフォームからご応募ください。
        </p>
      </div>
      <ApplicationForm />
    </div>
  )
}

export default ApplicationFormSection
