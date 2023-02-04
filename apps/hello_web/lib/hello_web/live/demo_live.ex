defmodule HelloWeb.DemoLive do
  use HelloWeb, :live_view

  @impl true
  def render(assigns) do
    ~H"""
    Hello Phoenix!
    """
  end
end
