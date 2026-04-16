import { CONFIG } from "site.config"
import dynamic from "next/dynamic"

const UtterancesComponent = dynamic(
  () => {
    return import("./Utterances")
  },
  { ssr: false }
)

type Props = {}

const CommentBox: React.FC<Props> = () => {
  return (
    <div>
      {CONFIG.utterances.enable && <UtterancesComponent />}
    </div>
  )
}

export default CommentBox
