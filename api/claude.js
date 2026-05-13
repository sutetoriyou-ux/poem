const Anthropic = require('@anthropic-ai/sdk');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'テキストを入力してください' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `以下の愚痴・不満を、五・七・五の俳句3句に昇華してください。俳句は詩的で美しく、怒りや不満を浄化した表現にしてください。返答は俳句3句のみを改行区切りで出力してください。番号や説明は不要です。\n\n愚痴：${text.trim()}`,
        },
      ],
    });

    const haiku = response.content[0]?.text ?? '';
    return res.status(200).json({ haiku });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '変換に失敗しました' });
  }
};
