defmodule HelloWeb.ModernAssets do
  use Phoenix.Component
  import Phoenix.HTML, only: [raw: 1]

  @bridge_file Path.expand("../../priv/static/app.html", __DIR__)

  @external_resource @bridge_file

  @bridge_ast @bridge_file
              |> File.read()
              |> case(
                do:
                  (
                    {:ok, content} -> content
                    {:error, _} -> "<html><head></head><body></body></html>"
                  )
              )
              |> Floki.parse_document!()
              |> Floki.filter_out(:comment)

  @raw_head_html @bridge_ast
                 |> Floki.find("head")
                 |> Floki.attr("script[src]", "phx-track-static", fn _ -> "" end)
                 |> Floki.attr("link[href]", "phx-track-static", fn _ -> "" end)
                 |> Enum.at(0)
                 |> Floki.children()
                 |> Floki.raw_html()

  @raw_body_html @bridge_ast
                 |> Floki.find("body")
                 |> Enum.at(0)
                 |> Floki.children()
                 |> Floki.raw_html()

  def modern_assets_head(assigns) do
    ~H"""
    <%= raw(raw_head_html()) %>
    """
  end

  def modern_assets_body(assigns) do
    ~H"""
    <%= raw(raw_body_html()) %>
    """
  end

  defp raw_head_html(), do: @raw_head_html
  defp raw_body_html(), do: @raw_body_html
end
