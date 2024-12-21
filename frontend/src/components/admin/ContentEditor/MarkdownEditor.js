import { memo} from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({label, value, changeValue, name, invalidFields, setInvalidFields}) =>  {
  return (
    <div className='d-flex flex-column'>
      <span>{label}</span>
      <Editor
        apiKey= 'pnfe737m5if1a86anesnyu9mngaaces9l9wi2mox76l56y9z'
        initialValue={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange={e => changeValue(prev => ({...prev, [name]: e.target.getContent()}))}
        onFocus={() => setInvalidFields && setInvalidFields([]) }
      />
      {invalidFields?.some(el => el.name ===name) && <small>{invalidFields?.find(el => el.name === name)?.message}</small>}
    </div>
  );
}
export default memo(MarkdownEditor);